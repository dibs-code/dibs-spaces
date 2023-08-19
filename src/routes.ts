export enum RoutePath {
  HOME = '/',
  REWARDS = '/rewards',
  REPORTS = '/reports',
  PAIR_ISOLATED = '/pair-isolated',
  PAIR_REWARDER_LEADERBOARD = '/pair-isolated/:address/leaderboard',

  YOUR_CODE_TEST = 'your-code-test',
  REWARDS_TEST = '/rewards-test',
  PAIR_REWARDER_LEADERBOARD_TEST = '/pair-isolated/test/leaderboard',
}

export function requiresCode(routePath: string) {
  return routePath === RoutePath.REWARDS;
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
