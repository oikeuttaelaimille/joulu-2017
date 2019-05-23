module.exports = {
  pathPrefix: `/lahja`,
  siteMetadata: {
    title: 'gatsby-starter-typescript-plus',
    description: 'A starter kit for TypeScript-based Gatsby projects with sensible defaults.',
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/src/content`
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1140,
              quality: 90,
              linkImagesToOriginal: false
            }
          }
        ]
      }
    },
    'gatsby-transformer-json',
    'gatsby-plugin-emotion',
    'gatsby-plugin-sass',
    'gatsby-plugin-typescript',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-react-helmet'
  ]
}
