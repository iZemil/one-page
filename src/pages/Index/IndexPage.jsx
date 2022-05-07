import React from 'react';
import cn from 'classnames';

import Header from 'components/Header';
import Intro from 'components/Intro';
// import Experience from 'components/Experience';
// import Workflow from 'components/Workflow';
// import Services from 'components/Services';
import Contacts from 'components/Contacts';

const MENU = [
    { title: 'Intro', component: <Intro /> },
    // { title: 'Services', component: <Services /> },
    // { title: 'Portfolio', component: <Experience /> },
    // { title: 'Workflow', component: <Workflow /> },
    { title: 'Contact us', component: <Contacts /> },
];

const Menu = ({ className }) => (
    <ul className={className}>
        {MENU.map(({ title }, index) => (
            <li
                key={title}
                className={cn({
                    'is-active': index === 0,
                })}
            >
                <span>{title}</span>
            </li>
        ))}
    </ul>
);

function IndexPage() {
    const wallpaper = (
        <div className="animation">
            <div className="content">
                <canvas className="landscape" />

                {/* <h2 className="content__title">G4M4</h2> */}
                <p className="content__subtitle" />
            </div>

            <div className="overlay" />
        </div>
    );

    return (
        <div className="perspective effect-rotate-left">
            <div id="large-header" className="container">
                <div className="outer-nav--return" />

                <div id="viewport" className="l-viewport">
                    <div className="l-wrapper">
                        <Header />

                        <nav className="l-side-nav">
                            <Menu className="side-nav" />
                        </nav>

                        <ul className="l-main-content main-content">
                            {MENU.map(({ title, component }, index) => (
                                <li
                                    key={title}
                                    className={cn('l-section section', {
                                        'section--is-active': index === 0,
                                    })}
                                >
                                    {component}
                                </li>
                            ))}
                        </ul>

                        {wallpaper}
                    </div>
                </div>
            </div>

            <Menu className="outer-nav" />
        </div>
    );
}

export default IndexPage;
