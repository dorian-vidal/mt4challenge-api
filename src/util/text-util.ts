export class TextUtil {
  /**
   * Remove line breaks from text.
   * @param text Given text.
   */
  public static escapeLineBreaks(text: string): string {
    return text.replace(/\n/g, '');
  }
}
