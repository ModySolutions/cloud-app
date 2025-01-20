export const navigate = (event) => {
    event.preventDefault();
    const link = event.currentTarget.getAttribute('href');
    window.history.pushState({}, '', link);
    window.dispatchEvent(new PopStateEvent('popstate'));
}