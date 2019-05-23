import * as React from 'react'
import Helmet from 'react-helmet'

import 'modern-normalize'
import '../styles/normalize'
import '../style/index.css';
import '../style/App.css';

const IndexLayout: React.SFC = ({ children }) => (
  <div>
    <Helmet
      title="Oikeutta eläimille"
      meta={[
        { name: 'description', content: 'Oikeutta eläimille' },
        { name: 'keywords', content: 'gatsbyjs, gatsby, javascript, sample, something' }
      ]}
    />
    <div className="container">
        {children}
    </div>
  </div>
)

export default IndexLayout
