import React from 'react';
import { SKILLS } from 'utils/constants';
import './Skills.styl';

export default function Skills() {
    return (
        <div className="skills">
            <div className="skills__content">
                <h2 className="skills__title">Skills</h2>
                <div className="modal">
                    <table>
                        <tbody>
                            {SKILLS.map(skill => (
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
