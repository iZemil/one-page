const POINTS = [
    {
        title: 'About me',
        list: [
            'Fullstack javascript dev',
            `Experience more than ${new Date().getFullYear() - 2016 + 1} years`,
            'Prefer React/Mobx on Frontend',
            'Prefer Express/Mongoose on Backend'
        ]
    },
    {
        title: 'My goals',
        list: ['Advanced speaking english', 'Machine learning', 'Own projects']
    },
    {
        title: 'Work wishes',
        list: ['Teamwork', 'Skills expending', 'Complex projects', 'Remote']
    }
];

const EXPERIENCE = [
    {
        title: 'Freelance since 2015',
        list: [
            'Web development using Wordpress/Joomla',
            'Simple works with html/css',
            'Implemantation of ready-made solutions on PHP'
        ]
    },
    {
        title: 'Web studio since 2016 as html coder',
        list: [
            'Gulp, Pug/HTML, SCSS/CSS, BEM',
            'Cross-browser sites IE9+',
            'jQuery and jQuery plugins',
            '1С/MODX CMS, simple php edits',
            'Work with managers, designers, main coder'
        ]
    },
    {
        title: 'Web studio since 2017 as a frontend developer',
        list: [
            'Cross-browser sites especially Safari',
            'React, Redux, Atlassian Kit for React',
            'Jira client-side plugin development, work with jira api',
            'Work with managers, designer, senior frontend dev, backend jira devs'
        ]
    },
    {
        title: 'Startup since 2018 as a frontend developer',
        list: [
            'Work with frontend and backend team, product managers',
            'Task creation',
            'React, Mobx, mobx state tree, Ant design',
            'Tests with jest, enzyme',
            'Code review'
        ]
    }
];

const CONTACTS = [
    {
        title: 'e-mail',
        href: 'mailto:xxxzei@mail.ru',
        text: 'xxxzei@mail.ru'
    },
    {
        title: 'telegram',
        href: 'https://telegram.me/xxxzei',
        text: 'xxxzei'
    },
    {
        title: 'skype',
        href: 'skype:xxxzei?add',
        text: 'xxxzei'
    },
    {
        title: 'location',
        href: 'https://www.google.com/search?q=Челябинск&amp;oq=Челябинск',
        text: 'Chelyabinsk'
    }
];

const SKILLS = [
    'Javascript, ES6, Typescript',
    'React/Redux/Mobx, Vue/Vuex',
    'Nodejs, Express, Mongoose',
    'CSS, SASS, Stylus',
    'HTML, Pug(Jade), BEM',
    'Jest, Enzyme',
    'Webpack, gulp',
    'Git (Source tree, SmartGit, simple bash)'
];

export { POINTS, EXPERIENCE, CONTACTS, SKILLS };
