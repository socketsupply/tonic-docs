import esbuild from 'esbuild'
import Tonic from 'tonic-ssr'

export default class EsbuildModule extends Tonic {
  async render () {
    const {
      src,
      dest,
      url
    } = this.props

    delete this.props.src
    delete this.props.dest
    delete this.props.url

    try {
      await esbuild.build({
        ...this.props,
        entryPoints: [src],
        bundle: true,
        outfile: dest
      })

      return this.html`
        <script src="${url}"></script>
      `
    } catch (err) {
      return this.html`
        Unable to bundle (${err.message}).
      `
    }
  }
}
