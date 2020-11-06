import React from 'react';

import './styles.styl';

const CONTACTS = [
    {
        title: 'e-mail',
        href: 'mailto:xxxzei@mail.ru',
        text: 'hello@g4m4.com',
    },
    {
        title: 'linkedin',
        href: 'https://www.linkedin.com/in/emil-zaripov-8028b4170/',
        text: 'chief manager',
    },
    {
        title: 'skype',
        href: 'skype:g4m4?add',
        text: 'g4m4',
    },
];

export default function Contacts() {
    return (
        <div className="contacts">
            <div className="contacts__content">
                {CONTACTS.map(({ title, href, text }) => (
                    <p key={title}>
                        {title}:&nbsp;<a href={href} target="_blank" rel="noopener noreferrer">
                            {text}
                        </a>
                    </p>
                ))}
            </div>
        </div>
    );
}
