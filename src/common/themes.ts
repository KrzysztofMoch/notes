type APP_THEMES_NAME = 'BLUE'|'PRIVATE';
type APP_THEME = { name: APP_THEMES_NAME, primary: string, secondary: string, fontColor: string}


const APP_THEMES_LIST: Array<APP_THEME> = [
  {
    name: 'BLUE',
    primary: '#9ebedb',
    secondary: '#255585',
    fontColor: '#fff',
  },
  {
    name: 'PRIVATE',
    primary: '#33214f',
    secondary: '#6f44cc',
    fontColor: '#fff',
  }
];

const getAppTheme = (name: APP_THEMES_NAME): APP_THEME => {
  const themesMap = APP_THEMES_LIST.map(x => x.name);
  const themeIndex = themesMap.indexOf(name);

  return APP_THEMES_LIST[themeIndex];
}

export type { APP_THEMES_NAME, APP_THEME }
export { APP_THEMES_LIST }
export default getAppTheme;