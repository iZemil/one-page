import React from 'react';
import img from 'assets/images/side.png';
import './MyCode.styl';

export default function Experience() {
    return (
        <div className="my-code">
            <div className="my-code__content">
                <h2>My code</h2>

                <p className="my-code__desc">
                    Write me to see code samples<br /> or maybe you find my code
                    interesting on{' '}
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/iZemil/"
                    >
                        github
                    </a>
                </p>

                <img src={img} alt="zemil github" />
            </div>
        </div>
    );
}
