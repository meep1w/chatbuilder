/** Return of ThemedColors structure */
type RemapTokensOutput<T> = {
   [K in ThemeModes]: {
      [LA in keyof T]: {
         [TO in keyof T[LA]]: Color
      }
   }
}

/** Maps ThemedColorsMapParameter tokens object to a safely typed top level themed key object */
export const remapTokens = <T extends ThemedColorsMapParameter>(input: T): RemapTokensOutput<T> => {
   const output = {} as RemapTokensOutput<T>

   for (const layoutProp in input) {
      const layoutPropKey = layoutProp as keyof T // Assert Key Type

      for (const token in input[layoutPropKey]) {
         const tokenKey = input[layoutPropKey][token] // Assert Key Type

         for (const theme in tokenKey) {
            const themeKey = theme as ThemeModes // Assert Key Type

            // Initialize output Props
            output[themeKey] = output[themeKey] || {}
            output[themeKey][layoutPropKey] = output[themeKey][layoutPropKey] || {}

            output[themeKey][layoutPropKey][token] = (tokenKey as { [key in ThemeModes]: Color })[themeKey] // cant access prop of [key: string]
         }
      }
   }

   return output
}
