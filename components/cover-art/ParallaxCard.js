import React from "react";
import PropTypes from "prop-types";

export default class ParallaxCard extends React.Component {
  static propTypes = {
    isStatic: PropTypes.bool,
    borderRadius: PropTypes.string,
    shineStrength: PropTypes.number,
    cursorPointer: PropTypes.bool,
    containerRef: PropTypes.object,
    isHovered: PropTypes.bool,
    mousePosition: PropTypes.object,
  };

  static defaultProps = {
    isStatic: false,
    borderRadius: "12px",
    shineStrength: 0.4,
    cursorPointer: true,
    isHovered: undefined,
    mousePosition: undefined,
  };

  state = {
    rootElemWidth: 0,
    rootElemHeight: 0,
    isOnHover: false,
    container: {},
    shine: {},
    layers: this.props.children
      ? this.props.children.length
        ? this.props.children
        : [this.props.children]
      : [React.createElement("div", { style: this.props.style }, [])],
    layersTransform: [],
  };

  componentDidMount = () => {
    if (!this.props.isStatic) {
      const targetNode = this.node;
      if (targetNode) {
        const width = targetNode.clientWidth || targetNode.offsetWidth || targetNode.scrollWidth;
        const height = targetNode.clientHeight || targetNode.offsetHeight || targetNode.scrollHeight;
        if (width && height) {
          this.setState({
            rootElemWidth: width,
            rootElemHeight: height,
          });
        }
      }
      
      if (this.props.isHovered === undefined && this.node) {
        this.nodeMouseMove = (e) => {
          this.handleMove({ pageX: e.pageX, pageY: e.pageY });
        };
        this.nodeMouseEnter = () => {
          this.handleEnter();
        };
        this.nodeMouseLeave = () => {
          this.handleLeave();
        };
        
        this.node.addEventListener('mousemove', this.nodeMouseMove);
        this.node.addEventListener('mouseenter', this.nodeMouseEnter);
        this.node.addEventListener('mouseleave', this.nodeMouseLeave);
      }
    }
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.isHovered !== undefined && !this.props.isStatic) {
      const wasHovered = prevProps.isHovered !== undefined ? prevProps.isHovered : this.state.isOnHover;
      const isNowHovered = this.props.isHovered;
      
      if (isNowHovered && !wasHovered) {
        this.setState({ isOnHover: true });
      } else if (!isNowHovered && wasHovered) {
        this.setState({
          isOnHover: false,
          container: {
            additionalRotateX: 0,
            additionalRotateY: 0,
            scale: 1,
          },
          shine: {},
          layersTransform: [],
        });
      }
      
      if (this.props.mousePosition && isNowHovered && 
          (this.props.mousePosition.pageX !== prevProps.mousePosition?.pageX || 
           this.props.mousePosition.pageY !== prevProps.mousePosition?.pageY)) {
        this.handleMove(this.props.mousePosition);
      }
    }
  };

  componentWillUnmount = () => {
    if (this.node && !this.props.isStatic) {
      if (this.nodeMouseMove) {
        this.node.removeEventListener('mousemove', this.nodeMouseMove);
      }
      if (this.nodeMouseEnter) {
        this.node.removeEventListener('mouseenter', this.nodeMouseEnter);
      }
      if (this.nodeMouseLeave) {
        this.node.removeEventListener('mouseleave', this.nodeMouseLeave);
      }
    }
  };

  handleMove = ({ pageX, pageY }) => {
    if (this.props.isStatic) return;
    
    const targetNode = this.node;
    if (!targetNode) return;
    
    const layerCount = this.state.layers ? this.state.layers.length : 1;
    let { rootElemWidth, rootElemHeight } = this.state;
    
    if (!rootElemWidth || !rootElemHeight) {
      rootElemWidth = targetNode.clientWidth || targetNode.offsetWidth || targetNode.scrollWidth;
      rootElemHeight = targetNode.clientHeight || targetNode.offsetHeight || targetNode.scrollHeight;
      if (!rootElemWidth || !rootElemHeight) return;
    }
    
    const bodyScrollTop =
      document.body.scrollTop ||
      document.getElementsByTagName("html")[0].scrollTop;
    const bodyScrollLeft = document.body.scrollLeft;
    const offsets = targetNode.getBoundingClientRect();
    const wMultiple = 320 / rootElemWidth;
    const multiple = wMultiple * 0.07;
    const offsetX =
      0.52 - (pageX - offsets.left - bodyScrollLeft) / rootElemWidth;
    const offsetY =
      0.52 - (pageY - offsets.top - bodyScrollTop) / rootElemHeight;
    const dy = pageY - offsets.top - bodyScrollTop - rootElemHeight / 2;
    const dx = pageX - offsets.left - bodyScrollLeft - rootElemWidth / 2;
    const yRotate = (offsetX - dx) * multiple;
    const xRotate =
      (dy - offsetY) * (Math.min(offsets.width / offsets.height, 1) * multiple);
    const arad = Math.atan2(dy, dx);
    const rawAngle = (arad * 180) / Math.PI - 90;
    const angle = rawAngle < 0 ? rawAngle + 360 : rawAngle;

    this.setState({
      container: {
        additionalRotateX: xRotate * 0.3,
        additionalRotateY: yRotate * 0.3,
        scale: 1.05,
      },
      shine: {
        background: `linear-gradient(${angle}deg, rgba(255, 255, 255, ${
          ((pageY - offsets.top - bodyScrollTop) / rootElemHeight) *
          this.props.shineStrength
        }) 0%, rgba(255, 255, 255, 0) 80%)`,
        transform: `translateX(${offsetX * layerCount - 0.1}px) translateY(${
          offsetY * layerCount - 0.1
        }px)`,
      },
      layersTransform: this.state.layers
        ? this.state.layers.map((_, idx) => ({
            transform: `translateX(${
              offsetX * layerCount * ((idx * 1) / wMultiple)
            }px) translateY(${
              offsetY * layerCount * ((idx * 1) / wMultiple)
            }px)`,
          }))
        : this.props.children,
    });
  };

  handleTouchMove = (evt) => {
    evt.preventDefault();
    const { pageX, pageY } = evt.touches[0];
    this.handleMove({ pageX, pageY });
  };

  handleEnter = () => {
    if (this.props.isStatic) return;

    if (this.props.isHovered === undefined) {
      this.setState({ isOnHover: true });
    }
  };

  handleLeave = () => {
    if (this.props.isStatic) return;

    if (this.props.isHovered === undefined) {
      this.setState({
        isOnHover: false,
        container: {
          additionalRotateX: 0,
          additionalRotateY: 0,
          scale: 1,
        },
        shine: {},
        layersTransform: [],
      });
    }
  };

  renderLayers = () => {
    return (
      <div
        className='parallax-card-layers'
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: this.props.borderRadius,
          overflow: "hidden",
          transformStyle: "preserve-3d",
          backgroundColor: "transparent",
          zIndex: "2",
          ...this.props.style,
        }}
      >
        {React.Children.map(this.state.layers, (child, idx) =>
          React.cloneElement(child, {
            style: {
              ...child.props.style,
              transition: "all 0.1s ease-out",
              zIndex: "4",
              ...(this.state.layersTransform[idx]
                ? this.state.layersTransform[idx]
                : {}),
            },
          })
        )}
      </div>
    );
  };

  render() {
    const perspectiveValue = this.state.rootElemWidth > 0 ? this.state.rootElemWidth * 3 : 1000;
    // Use external hover state if provided, otherwise use internal state
    const isHovered = this.props.isHovered !== undefined ? this.props.isHovered : this.state.isOnHover;
    
    return (
      <div 
        style={{ 
          display: "flex", 
          width: "100%", 
          height: "100%", 
          perspective: `${perspectiveValue}px`,
          perspectiveOrigin: "center center",
          pointerEvents: "auto"
        }}
        ref={(node) => {
          this.node = node;
        }}
      >
        <div
          onClick={this.props.onClick}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: this.props.borderRadius,
            transformStyle: "preserve-3d",
            WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
            cursor: this.props.cursorPointer ? "pointer" : "default",
            zIndex: isHovered ? "9" : "unset",
          }}
          className='parallax-card'
        >
          <div
            className='parallax-card-container'
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: this.props.borderRadius,
              transition: "all 0.2s ease-out",
              transform: this.props.isStatic 
                ? "rotateY(15deg)"
                : `rotateY(${15 + (this.state.container?.additionalRotateY || 0)}deg) rotateX(${this.state.container?.additionalRotateX || 0}deg) scale(${this.state.container?.scale || 1})`,
            }}
          >
            <div
              className='parallax-card-shadow'
              style={{
                position: "absolute",
                top: "5%",
                left: "5%",
                right: "5%",
                bottom: "5%",
                transition: "all 0.2s ease-out",
                zIndex: "0",
                boxShadow: isHovered
                  ? "0 45px 100px rgba(14, 21, 47, 0.4), 0 16px 40px rgba(14, 21, 47, 0.4)"
                  : "0 8px 30px rgba(14, 21, 47, 0.6)",
              }}
            />
            <div
              className='parallax-card-shine'
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                borderRadius: this.props.borderRadius,
                background: `linear-gradient(135deg,rgba(255, 255, 255, ${
                  this.props.shineStrength / 1.6
                }) 0%,rgba(255, 255, 255, 0) 60%)`,
                zIndex: "8",
                ...this.state.shine,
              }}
            />
            {this.renderLayers()}
          </div>
        </div>
      </div>
    );
  }
} // Thank you to jamipuchi for the 3D card (https://github.com/jamipuchi/animated-3d-card)

