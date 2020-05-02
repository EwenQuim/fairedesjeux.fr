const tailwind = require('tailwindcss');
const postcssPresetEnv = require('postcss-preset-env');
const slugify = require('@sindresorhus/slugify');

const postcssPlugins = [
    postcssPresetEnv({ stage: 0, autoprefixer: false }),
    tailwind('./tailwind.config.js'),
];

module.exports = {
    siteName: 'FaireDesJeux.fr',
    plugins: [
        {
            use: '@gridsome/source-filesystem',
            options: {
                typeName: 'Section',
                baseDir: './content/courses/',
                path: ['**/*.md', '!**/course.md'],
            },
        },
        {
            use: '@gridsome/source-filesystem',
            options: {
                typeName: 'Chapter',
                baseDir: './content/courses',
                path: '**/chapter.json',
            },
        },
        {
            use: '@gridsome/source-filesystem',
            options: {
                typeName: 'Course',
                baseDir: './content/courses/',
                path: '**/course.md',
            },
        },
    ],
    templates: {
        Section: [{
            path: (node) => {
                /*
                    NOTE : Since we can't get the chapter name from the node itself due to it being added later
                    (in onCreateNode) we can't get it here (why) so we have to get it ourselves - erika, 2020-04-20
                */
                const slashPosition = node.fileInfo.directory.indexOf('/');
                const idToRemove = node.fileInfo.directory.substr(slashPosition + 1, 3);

                return `/${node.fileInfo.directory.replace(idToRemove, '')}/${node.slug !== undefined ? slugify(node.slug) : slugify(node.fileInfo.name.substr(3))}`;
            },
            component: './src/templates/Sections.vue',
        }],
        Course: [{
            path: '/:fileInfo__directory',
            component: './src/templates/Courses.vue',
        }],
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins: postcssPlugins,
            },
        },
    },
    transformers: {
        remark: {
            imageQuality: 100,
            config: {
                footnotes: true,
            },
            plugins: [
                '@gridsome/remark-prismjs',
                ['gridsome-plugin-remark-container', {
                    customTypes: {
                        astride: {
                            defaultTitle: 'Astride',
                        },
                        marvin: {
                            defaultTitle: 'Marvin',
                        },
                        remi: {
                            defaultTitle: 'Rémi',
                        },
                    },
                    useDefaultTypes: false,
                    icons: 'none',
                    classMaster: 'bubble',
                }],
            ],
        },
    },
    chainWebpack: (config) => {
        config.resolve.alias.set('@coursesCovers', '@/assets/courses');
    },
};
