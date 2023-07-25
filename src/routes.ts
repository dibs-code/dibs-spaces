export enum RoutePath {
  HOME = '/',
  REWARDS = '/rewards',
  REPORTS = '/reports',
  TEST_SWAP = '/test-swap',
  PAIR_ISOLATED = '/pair-isolated',
  PAIR_REWARDER_CREATE = '/pair-isolated/create',
  PAIR_REWARDER_LEADERBOARD = '/pair-isolated/:address/leaderboard',
  PAIR_REWARDER_SET_PRIZE = '/pair-isolated/:address/set-prize',
}

export function requiresCode(routePath: string) {
  return routePath !== RoutePath.HOME && !routePath.startsWith('/pair-isolated');
}

export function getRoute(path: RoutePath, params?: { [key: string]: string }) {
  let res: string = path;
  if (params) {
    for (const key in params) {
      res = res.replace(`:${key}`, params[key]);
    }
  }
  return res;
}

export default RoutePath;
