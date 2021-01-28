const metaData = args => {
  const {
    title,
    description,
    image,
    url,
    siteName
  } = args

  return `
    <title>${title}</title>
    <link rel="preload" href="fonts/Inter.ttf" as="font" type="font/ttf" crossorigin="anonymous">
    <link rel="preload" href="fonts/SourceCodePro-Regular.ttf" as="font" type="font/ttf" crossorigin="anonymous">

    <link rel="icon" type="image/png" href="images/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="images/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="images/favicon-96x96.png" sizes="120x120">
    <link rel="icon" type="image/png" href="images/favicon-96x96.png" sizes="128x128">
    <link rel="apple-touch-icon" type="image/png" href="images/favicon-152x152.png" sizes="152x152">
    <link rel="apple-touch-icon" type="image/png" href="images/favicon-167x167.png" sizes="167x167">
    <link rel="apple-touch-icon" type="image/png" href="images/favicon-180x180.png" sizes="180x180">

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1 user-scalable=no">

    <meta name="description" content="${description}">

    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:site_name" content="${siteName}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@tonicframework">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:image" content="${image}">
    <meta name="twitter:description" content="${description}">
  `
}

export default metaData
