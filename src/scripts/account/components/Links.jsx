import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

const Links = ({ routes }) => {
    if (!routes || Object.keys(routes).length === 0) {
        return '';
    }

    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    const navigate = (event) => {
        event.preventDefault();
        const link = event.currentTarget.getAttribute('href');
        setCurrentPath(link);
        window.history.pushState({}, '', link);
        window.dispatchEvent(new PopStateEvent('popstate'));
    }

    const routesEntries = Object.entries(routes).map(([key, value]) => ({
        link: key.endsWith('/') ? key : `${key}/`,
        title: value
    }));

    return (
        <>
            {routesEntries.map(({ link, title }) => {
                return <a
                    href={link}
                    key={link}
                    onClick={navigate}
                    className={`link${currentPath === link ? ' active' : ''}`}
                >
                    {__(title)}
                </a>
            })}
        </>
    );
};

export default Links;
