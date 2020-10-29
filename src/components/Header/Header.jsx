import React from 'react';
import './Header.styl';

export default function Header() {
    return (
        <header className="header">
            <a className="header--logo" href="https://zemil.ru">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="-9 11 40 40"
                    enableBackground="new -9 11 40 40"
                >
                    <path
                        fill="#FFFFFF"
                        d="M28.808 48.704c1.36-1.385 2.192-3.065 2.192-5.058 0-1.984-1.616-3.736-2.433-5.489-1.712-3.697-1.735-6.617-1.735-7.153 0-.535.008-3.433 1.735-7.153.817-1.753 2.433-3.505 2.433-5.49 0-1.992-.832-3.673-2.192-5.057l-.088-.087c-1.392-1.377-3.08-2.217-5.08-2.217-1.983 0-3.735 1.616-5.487 2.432-3.705 1.721-6.625 1.737-7.161 1.737-.536 0-3.448.008-7.144-1.737-1.752-.832-3.504-2.432-5.488-2.432-1.992 0-3.672.832-5.056 2.192l-.104.104c-1.368 1.385-2.2 3.073-2.2 5.065 0 1.984 1.616 3.736 2.432 5.489 1.729 3.721 1.736 6.625 1.736 7.153 0 .527-.024 3.441-1.736 7.153-.808 1.762-2.432 3.506-2.432 5.49 0 1.992.832 3.673 2.192 5.058l.087.088c1.385 1.368 3.073 2.208 5.073 2.208 1.984 0 3.784-1.521 5.488-2.433 3.704-1.712 6.632-1.736 7.151-1.736.521 0 3.417.016 7.152 1.736 1.705.912 3.504 2.433 5.49 2.433 1.991 0 3.672-.832 5.063-2.201l.112-.095z"
                    />
                </svg>
                <h1 className="content__title">G4M4</h1>
            </a>

            <button type="button" className="header--cta cta">
                Contact us
            </button>

            <div className="header--nav-toggle">
                <span />
            </div>

            {/* <a
                className="print-version"
                href="https://docs.google.com/document/d/1buQQpN3VL8BosaLrfHdklLspTEcAQNjFVPIjs9cOv5g/edit?usp=sharing"
                title="Print version"
                target="_blank"
                rel="noopener noreferrer"
            >
                Print version
            </a> */}
        </header>
    );
}
