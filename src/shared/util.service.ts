export class UtilService {
  /**
   * targetのいずれもnull or undefinedであることをチェックする
   *
   * ex.
   * OK: -1, 0, 5, true, false, '', 'null', [], [null], {}, NaN
   * NG: null, undefined
   *
   * @param targets
   */
  static containsNullable(...targets: unknown[]) {
    return targets.some(target => target == null);
  }
}
