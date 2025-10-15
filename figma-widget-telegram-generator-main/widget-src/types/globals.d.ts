import { THEME_MODES } from "@/constants"

declare global {
   /** Display Modes */
   interface OptionalRender {
      /** Applies to all Elements except children
       *
       * When false: Renders Children only (Elements wont be present in tree)
       * otherwise use isVisible or hidden
       *  */
      renderElements: boolean
      /** Children always visible (shows In tree) */
      isVisible?: boolean
   }

   /** Common Component Props (Required) */
   interface ReqCompProps {
      /** Theme Mode, Set Color Variables */
      theme: ThemeModes
   }

   /** Component Props contains event
    * Generic `P`: onEvent callback parameters (support array of arguments passed to callback)
    */
   interface ContainsEvent<P extends unknown[] = [WidgetClickEvent], V = never> {
      /** TextEditEvent Inputs Value */
      value: ifGen<V, V, P[0] extends WidgetClickEvent ? number : string>
      /** example User Click Event */
      onEvent: (...args: P) => void
   }

   // Theme

   /** Hex & Primitives */
   type Color = `#${string}` | PrimitiveColor | (WidgetJSX.SolidPaint | WidgetJSX.GradientPaint)[]

   type ThemeModes = (typeof THEME_MODES)[number]

   type LayoutProps = "surface" | "text" | "stroke" | "effects"

   /** Constant per Component with theme mode variables */
   type ThemedColorsMapParameter = {
      [key in LayoutProps]?: {
         [key: string]: { [key in ThemeModes]: Color }
      }
   }

   type ThemedColors = {
      [key in ThemeModes]: {
         [key in LayoutProps]?: {
            [key: string]: Color
         }
      }
   }
}
