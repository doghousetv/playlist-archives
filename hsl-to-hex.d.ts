declare module "hsl-to-hex" {
  /**
   * Converts HSL color values to a hex string
   * @param hue - Hue value in degrees (0-359, supports values outside this range)
   * @param saturation - Saturation percentage (0-100)
   * @param luminosity - Luminosity percentage (0-100)
   * @returns Hex color string (e.g., "#ff0000")
   */
  function hsl(hue: number, saturation: number, luminosity: number): string;
  export default hsl;
}

