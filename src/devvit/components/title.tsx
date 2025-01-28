import {Devvit} from '@devvit/public-api'
import {paletteBlack, paletteWhite} from '../../shared/theme.ts'

export type TitleProps = {children?: JSX.Children}

export function Title(props: Readonly<TitleProps>): JSX.Element {
  return (
    <zstack
      alignment='top center'
      backgroundColor={paletteWhite}
      borderColor={paletteBlack}
      width='100%'
      height='100%'
    >
      <image
        description='TV Paint'
        url='logo.png'
        imageWidth='500px'
        imageHeight='352px'
        width='100%'
        height='100%'
        resizeMode='fit'
      />
      <vstack
        alignment='bottom end'
        padding='medium'
        width='100%'
        height='100%'
      >
        {props.children ?? null}
      </vstack>
    </zstack>
  )
}
