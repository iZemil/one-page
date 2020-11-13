import React from 'react';
import Slider from 'react-slick';

import { SliderArrow } from '../Experience';

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
        title: 'Процесс контакта',
        list: ['Написать сообщение о проекте', 'Оговорить детали проекта', 'Согласовать ТЗ прототипа'],
    },
    {
        title: 'Процесс согласования прототипа',
        list: ['Ок, доработка ТЗ для проекта', 'Нет, деньги обратно'],
    },
    {
        title: 'Процесс поддержки проекта',
        list: ['В случае, если требуется дальнейшая работа'],
    },
];

export default function Experience() {
    return (
        <div className="experience">
            <div className="experience__content">
                <Slider {...settings}>
                    {EXPERIENCE.map(({ title, list }) => (
                        <div className="experience__slider-item" key={title}>
                            <h3>{title}</h3>
                            <ul className="experience__slider-item-list">
                                {list.map((item) => (
                                    <li key={item}>
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
