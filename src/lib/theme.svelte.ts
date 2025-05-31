import { browser } from '$app/environment';

class Theme {
    current = $state(browser && localStorage.getItem('data-theme'))

    toggle = () => {
        const theme = this.current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('data-theme', theme)
        this.current = theme;
    }
}

export const theme = new Theme();
