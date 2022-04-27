import { store } from "../redux/store";

type APP_THEMES_NAME = 'BLUE'|'RED'|'ORANGE'|'PINK'|'GREEN'|'PRIVATE'|'CUSTOM';
type APP_THEME = { name: APP_THEMES_NAME, primary: string, secondary: string, fontColor: string}

const APP_THEMES_LIST: Array<APP_THEME> = [
  {
    name: 'BLUE',
    primary: '#255585',
    secondary: '#9ebedb',
    fontColor: '#fff',
  },
  {
    name: 'RED',
    primary: '#5b1e1e',
    secondary: '#cd4343',
    fontColor: '#fff',
  },
  {
    name: 'ORANGE',
    primary: '#d8471a',
    secondary: '#ff8e1e',
    fontColor: '#fff',
  },
  {
    name: 'PINK',
    primary: '#7e396b',
    secondary: '#ff73d9',
    fontColor: '#fff',
  },
  {
    name: 'GREEN',
    primary: '#0c5a00',
    secondary: '#16a600',
    fontColor: '#fff',
  },
];

const PRIVATE_THEME: APP_THEME = {
  name: 'PRIVATE',
  primary: '#33214f',
  secondary: '#6f44cc',
  fontColor: '#fff',
}

const getAppTheme = (name: APP_THEMES_NAME): APP_THEME => {
  console.log(name);

  if(name === 'PRIVATE') {
    return PRIVATE_THEME;
  }
  else if (name ==='CUSTOM') {
    return store.getState().settings.customTheme;
  }

  const themesMap = APP_THEMES_LIST.map(x => x.name);
  const themeIndex = themesMap.indexOf(name);

  return APP_THEMES_LIST[themeIndex];
}

export type { APP_THEMES_NAME, APP_THEME }
export { APP_THEMES_LIST }
export default getAppTheme;