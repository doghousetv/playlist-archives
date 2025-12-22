// ** React/Next.js Imports
import React from "react";

// ** Third-Party Imports
import PropTypes from "prop-types";

export default class ParallaxCard extends React.Component {
  static propTypes = {
    isStatic: PropTypes.bool,
    borderRadius: PropTypes.string,
    shineStrength: PropTypes.number,
    cursorPointer: PropTypes.bool,
    containerRef: PropTypes.object,
  };

  static defaultProps = {
    isStatic: false,
    borderRadius: "12px",
    shineStrength: 0.4,
    cursorPointer: true,
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
      const targetNode = this.props.containerRef?.current || this.node;
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
      
      // Attach event listeners to containerRef if provided
      if (this.props.containerRef?.current) {
        const container = this.props.containerRef.current;
        this.containerMouseMove = (e) => {
          this.handleMove({ pageX: e.pageX, pageY: e.pageY });
        };
        this.containerMouseEnter = () => {
          this.handleEnter();
        };
        this.containerMouseLeave = () => {
          this.handleLeave();
        };
        
        container.addEventListener('mousemove', this.containerMouseMove);
        container.addEventListener('mouseenter', this.containerMouseEnter);
        container.addEventListener('mouseleave', this.containerMouseLeave);
      }
    }
  };

  componentWillUnmount = () => {
    if (this.props.containerRef?.current && !this.props.isStatic) {
      const container = this.props.containerRef.current;
      if (this.containerMouseMove) {
        container.removeEventListener('mousemove', this.containerMouseMove);
      }
      if (this.containerMouseEnter) {
        container.removeEventListener('mouseenter', this.containerMouseEnter);
      }
      if (this.containerMouseLeave) {
        container.removeEventListener('mouseleave', this.containerMouseLeave);
      }
    }
  };

  handleMove = ({ pageX, pageY }) => {
    if (this.props.isStatic) return;
    
    // Use containerRef if provided, otherwise use local node
    const targetNode = this.props.containerRef?.current || this.node;
    if (!targetNode) return;
    
    const layerCount = this.state.layers ? this.state.layers.length : 1;
    let { rootElemWidth, rootElemHeight } = this.state;
    
    // Recalculate dimensions if not set or if they're 0
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

    // Only apply subtle hover effects without changing the base parallelogram shape
    // Keep the base rotateY(15deg) constant and only add minimal additional rotations
    this.setState({
      container: {
        // Only add very subtle rotations on top of the base rotateY(15deg)
        // These will be combined in the render method
        additionalRotateX: xRotate * 0.3, // Reduce intensity
        additionalRotateY: yRotate * 0.3, // Reduce intensity
        scale: 1.05, // Scale on hover
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
    this.setState({ isOnHover: true });
  };

  handleLeave = () => {
    if (this.props.isStatic) return;
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
        {this.state.layersTransform &&
          React.Children.map(this.state.layers, (child, idx) =>
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
        ;
      </div>
    );
  };

  render() {
    const perspectiveValue = this.state.rootElemWidth > 0 ? this.state.rootElemWidth * 3 : 1000;
    // If containerRef is provided, attach events to it via useEffect-like behavior
    // For now, we'll use the containerRef for calculations but keep events on this element
    
    return (
      <div 
        style={{ 
          display: "flex", 
          width: "100%", 
          height: "100%", 
          perspective: `${perspectiveValue}px`,
          perspectiveOrigin: "center center"
        }}
        onMouseMove={this.props.isStatic ? undefined : (e) => {
          this.handleMove({ pageX: e.pageX, pageY: e.pageY });
        }}
        onMouseEnter={this.props.isStatic ? undefined : this.handleEnter}
        onMouseLeave={this.props.isStatic ? undefined : this.handleLeave}
        onTouchMove={this.props.isStatic ? undefined : this.handleTouchMove}
        onTouchStart={this.props.isStatic ? undefined : this.handleEnter}
        onTouchEnd={this.props.isStatic ? undefined : this.handleLeave}
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
            zIndex: this.state.isOnHover ? "9" : "unset",
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
              // Always maintain base rotateY(15deg) for parallelogram shape
              // Only add subtle hover rotations if not static
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
                boxShadow: this.state.isOnHover
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

