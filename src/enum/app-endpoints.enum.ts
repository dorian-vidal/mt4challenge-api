export class AppEndpointsEnum {
  private static readonly BASE: string = process.env.ALLOW_ORIGIN;
  public static readonly ME: string = AppEndpointsEnum.BASE + '/me';
  public static readonly REGISTER: string = AppEndpointsEnum.BASE + '/register';
  public static readonly DASHBOARD: string =
    AppEndpointsEnum.BASE + '/dashboard';
}
