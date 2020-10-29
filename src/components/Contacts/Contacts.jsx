import React from 'react';
import { CONTACTS } from 'utils/constants';
import './Contacts.styl';

export default function Contacts() {
    return (
        <div className="contacts">
            <div className="contacts__content">
                {CONTACTS.map(({ title, href, text }) => (
                    <p key={title}>
                        {title}:&nbsp;<a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {text}
                        </a>
                    </p>
                ))}
            </div>
        </div>
    );
}
