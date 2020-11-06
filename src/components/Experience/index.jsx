import React from 'react';
import Slider from 'react-slick';

import './Experience.styl';

const SliderArrow = ({ onClick, type }) => (
    <button type="button" className={`experience__slider-arrow experience__slider-arrow_${type}`} onClick={onClick}>
        <svg
            id="Layer_1"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 150 118"
            xmlSpace="preserve"
        >
            <g transform="translate(0.000000,118.000000) scale(0.100000,-0.100000)">
                <path d="M870,1167c-34-17-55-57-46-90c3-15,81-100,194-211l187-185l-565-1c-431,0-571-3-590-13c-55-28-64-94-18-137c21-20,33-20,597-20h575l-192-193C800,103,794,94,849,39c20-20,39-29,61-29c28,0,63,30,298,262c147,144,272,271,279,282c30,51,23,60-219,304C947,1180,926,1196,870,1167z" />
            </g>
        </svg>
    </button>
);

const settings = {
    className: 'experience__slider',
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SliderArrow type="next" />,
    prevArrow: <SliderArrow type="prev" />,
};

const EXPERIENCE = [
    {
        title: 'Freelance since 2015',
        list: [
            'Web development using Wordpress/Joomla',
            'Simple works with html/css',
            'Implemantation of ready-made solutions on PHP',
        ],
    },
    {
        title: 'Web studio since 2016 as html coder',
        list: [
            'Gulp, Pug/HTML, SCSS/CSS, BEM',
            'Cross-browser sites IE9+',
            'jQuery and jQuery plugins',
            '1С/MODX CMS, simple php edits',
            'Work with managers, designers, main coder',
        ],
    },
    {
        title: 'Web studio since 2017 as a frontend developer',
        list: [
            'Cross-browser sites especially Safari',
            'React, Redux, Atlassian Kit for React',
            'Jira client-side plugin development, work with jira api',
            'Work with managers, designer, senior frontend dev, backend jira devs',
        ],
    },
    {
        title: 'Startup since 2018 as a frontend developer',
        list: [
            'Work with frontend and backend team, product managers',
            'Task creation',
            'React, Mobx, mobx state tree, Ant design',
            'Tests with jest, enzyme',
            'Code review',
        ],
    },
];

export default function Experience() {
    return (
        <div className="experience">
            our projects and clients
            <div className="experience__content">
                <Slider {...settings}>
                    {EXPERIENCE.reverse().map(({ title, list }) => (
                        <div className="experience__slider-item" key={title}>
                            <h3>{title}</h3>
                            <ul className="experience__slider-item-list">
                                {list.map((item, index) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <li key={index}>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}
