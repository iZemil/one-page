import React from 'react';

import './styles.styl';

export default function Services() {
    return (
        <div className="services">
            <div className="services__content">
                {/* <h2 className="services__title">service list with prices</h2> */}
                <div className="services__table-wrapper">
                    <table>
                        <tbody>
                            {[
                                {
                                    title: 'Interface design',
                                    subtitle: 'from 2.5k $ about 1 month',
                                    description:
                                        'Creation of a user-friendly interface with simplicity for the end user as the main priority',
                                },
                                {
                                    title: 'Websites',
                                    subtitle: 'from 6k $ about 1-2 months',
                                    description:
                                        'Creation and a launch of a new fully functioning website or a redesign of an already existing one',
                                },
                                {
                                    title: 'Web applications',
                                    subtitle: 'from 15k $ about 2-6 months',
                                    description:
                                        'Same as a regular website but we can integrate user profiles, chats, business logic, mini games, difficult forms etc',
                                },
                            ].map((it) => (
                                <tr key={it.title}>
                                    <td>
                                        <h3>{it.title}</h3>
                                        <small>{it.subtitle}</small>
                                        <p>{it.description}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
