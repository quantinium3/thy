import { browser } from '$app/environment';

class Theme {
    current = $state(browser && localStorage.getItem('theme'))

    toggle = () => {
        const theme = this.current === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.contains("dark")
        localStorage.setItem('theme', theme)
        this.current = theme;
    }
}

export const theme = new Theme();
