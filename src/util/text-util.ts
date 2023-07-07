export class TextUtil {
  public static escapeLineBreaks(text: string): string {
    return text.replace(/\n/g, '');
  }
}
