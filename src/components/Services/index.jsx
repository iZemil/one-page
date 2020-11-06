import React from 'react';

import './styles.styl';

export default function Services() {
    return (
        <div className="skills">
            <div className="skills__content">
                <h2 className="skills__title">service list with prices</h2>
                <div className="modal">
                    <table>
                        <tbody>
                            {[
                                'Web (The full cycle of services to create and launch a website from scratch or redesign a live website along with the modern trends and requirements.)',
                                'Mobile apps (We create elegant user experience for applications that achieve business goals and make users happy.)',
                                'Branding (We create strong branding for products and companies. From brand model to the design system, we build identities that translate your company values.)',
                            ].map((skill) => (
                                <tr key={skill}>
                                    <td>{skill}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
