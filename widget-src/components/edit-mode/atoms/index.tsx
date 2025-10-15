// Dependencies
const { AutoLayout, Text, Input, SVG, Rectangle } = figma.widget

interface CreatorCompKitConfig extends Partial<AutoLayoutProps> {
   colorPalette: ThemedColors[ThemeModes]
}

export function Section({ children, ...props }: Partial<CreatorCompKitConfig>) {
   return (
      <AutoLayout name="Section" overflow="visible" direction="vertical" spacing={12} width="fill-parent" {...props}>
         {children}
      </AutoLayout>
   )
}

interface LabelProps extends CreatorCompKitConfig {
   children: string
   isCollapsable?: boolean
}

export function Label({ colorPalette, isCollapsable = false, children, ...props }: LabelProps) {
   const svgPaths = {
      arrowDown: `<svg width='16' height='10' viewBox='0 0 16 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
             <path d='M1.88 0L8 6.18084L14.12 0L16 1.90283L8 10L0 1.90283L1.88 0Z' fill='${colorPalette.text?.default}'/>
         </svg>`,
   }

   return (
      <AutoLayout
         name="label"
         opacity={isCollapsable ? 0.5 : 1}
         overflow="visible"
         spacing={8}
         padding={{
            vertical: 0,
            horizontal: 16,
         }}
         width="fill-parent"
         horizontalAlignItems="center"
         verticalAlignItems="center"
         {...props}
      >
         <Text name="title" fill={colorPalette.text?.default} width="fill-parent" lineHeight={22} fontSize={17} fontWeight={500}>
            {children}
         </Text>
         <SVG hidden={!isCollapsable} name="Vector" height={10} width={16} src={svgPaths.arrowDown} />
      </AutoLayout>
   )
}

export function ButtonsRow({ children, ...props }: Partial<CreatorCompKitConfig>) {
   return (
      <AutoLayout name="Button Row" overflow="visible" spacing={12} width="fill-parent" verticalAlignItems="center" {...props}>
         {children}
      </AutoLayout>
   )
}

interface ButtonProps<A extends unknown[] = [WidgetClickEvent]> extends CreatorCompKitConfig, PartialPick<ContainsEvent<A>, "value"> {
   children?: string
   icon?: "plus" | "minus"
}

export function ButtomSmall({ colorPalette, icon, children, onEvent, ...props }: ButtonProps) {
   const svgPaths = {
      plus: `<svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
             <path d='M7.05714 6.90714H11.8C11.9381 6.90714 12.05 6.79521 12.05 6.65714V5.34286C12.05 5.20479 11.9381 5.09286 11.8 5.09286H7.05714C6.9743 5.09286 6.90714 5.0257 6.90714 4.94286V0.2C6.90714 0.0619289 6.79521 -0.05 6.65714 -0.05H5.34286C5.20479 -0.05 5.09286 0.0619287 5.09286 0.2V4.94286C5.09286 5.0257 5.0257 5.09286 4.94286 5.09286H0.2C0.0619289 5.09286 -0.05 5.20479 -0.05 5.34286V6.65714C-0.05 6.79521 0.0619287 6.90714 0.2 6.90714H4.94286C5.0257 6.90714 5.09286 6.9743 5.09286 7.05714V11.8C5.09286 11.9381 5.20479 12.05 5.34286 12.05H6.65714C6.79521 12.05 6.90714 11.9381 6.90714 11.8V7.05714C6.90714 6.9743 6.9743 6.90714 7.05714 6.90714Z' fill='white' stroke='${colorPalette.text?.white}' stroke-width='0.1'/>
         </svg>`,
      minus: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_139_8212)"><path d="M7.05709 6.90715H11.8C11.9381 6.90715 12.05 6.79522 12.05 6.65715V5.34287C12.05 5.2048 11.9381 5.09287 11.8 5.09287H7.05709C6.97425 5.09287 7 5.09287 6.90709 5.09287C7 5.09287 6.79516 5.09287 6.65709 5.09287H5.34281C5.20474 5.09287 5.5 5.0932 5.09281 5.09287C5 5.09277 5.02565 5.09287 4.94281 5.09287H0.199951C0.0618801 5.09287 -0.0500488 5.2048 -0.0500488 5.34287V6.65715C-0.0500488 6.79522 0.0618799 6.90715 0.199951 6.90715H4.94281C5.02565 6.90715 4.94281 6.90715 5.09281 6.90715C5.24281 6.90715 5.20474 6.90715 5.34281 6.90715H6.65709C6.79516 6.90715 6.5 6.90715 6.90709 6.90715C7 6.90715 6.97425 6.90715 7.05709 6.90715Z" fill="white" stroke="black" stroke-width="0.1"/>
            </g><defs><clipPath id="clip0_139_8212"><rect width="12" height="12" fill="white"/></clipPath></defs>
         </svg>`,
   }

   return (
      <AutoLayout
         name="Add"
         onClick={onEvent}
         hoverStyle={{
            fill: colorPalette.surface?.actionHover,
         }}
         fill={colorPalette.surface?.action}
         stroke={colorPalette.surface?.primary30}
         cornerRadius={6}
         overflow="visible"
         spacing={12}
         padding={{
            vertical: 8,
            horizontal: 16,
         }}
         width={(children ?? "").length > 0 ? "fill-parent" : 40}
         height={40}
         horizontalAlignItems="center"
         verticalAlignItems="center"
         {...props}
      >
         <Text hidden={(children ?? "").length == 0} name="Add Button Row" fill={colorPalette.text?.white} lineHeight={22} fontSize={14} fontWeight={600}>
            {children}
         </Text>
         <SVG name="plus" height={12} width={12} src={svgPaths[icon ?? "plus"]} />
      </AutoLayout>
   )
}

/** Branched from telegram chat button */
export function ChatButtonEditable({ colorPalette, onEvent, value, ...props }: Omit<ButtonProps<[TextEditEvent]>, "children">) {
   return (
      <AutoLayout
         name="ChatButton"
         effect={[
            {
               type: "drop-shadow",
               color: "#0000001F",
               offset: {
                  x: 0,
                  y: 4,
               },
               blur: 10.4,
               showShadowBehindNode: false,
            },
            {
               blur: 16.8,
               type: "background-blur",
            },
         ]}
         cornerRadius={6}
         width={"fill-parent"}
         height={40}
         horizontalAlignItems="center"
         verticalAlignItems="center"
         fill={colorPalette.surface?.telegramButton}
         {...props}
      >
         <Input
            name="Button 1"
            onTextEditEnd={onEvent}
            value={value ?? ""}
            placeholder="Button Text..."
            horizontalAlignText="center"
            fill={colorPalette.text?.white}
            verticalAlignText="center"
            lineHeight={18}
            fontSize={14}
            height={30}
            width={"fill-parent"}
            fontWeight={600}
         />
      </AutoLayout>
   )
}

export function Button({ colorPalette, children, onEvent, ...props }: ButtonProps) {
   const svgPaths = {
      plus: `<svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path transform='translate(0.5, 0)' opacity='0.9' d='M11.6667 11.5834H17.6667C18.357 11.5834 18.9167 11.0238 18.9167 10.3334V9.66675C18.9167 8.97639 18.357 8.41675 17.6667 8.41675H11.6667C11.2525 8.41675 10.9167 8.08096 10.9167 7.66675V1.66675C10.9167 0.976392 10.357 0.416748 9.66667 0.416748H9C8.30964 0.416748 7.75 0.976392 7.75 1.66675V7.66675C7.75 8.08096 7.41421 8.41675 7 8.41675H1C0.309644 8.41675 -0.25 8.97639 -0.25 9.66675V10.3334C-0.25 11.0238 0.309644 11.5834 1 11.5834H7C7.41421 11.5834 7.75 11.9192 7.75 12.3334V18.3334C7.75 19.0238 8.30964 19.5834 9 19.5834H9.66667C10.357 19.5834 10.9167 19.0238 10.9167 18.3334V12.3334C10.9167 11.9192 11.2525 11.5834 11.6667 11.5834Z' fill='${colorPalette.text?.inverted}' stroke='${colorPalette.text?.inverted}' stroke-width='0.5'/>
          </svg>`,
   }

   return (
      <AutoLayout
         name="Button"
         onClick={onEvent}
         hoverStyle={{
            fill: colorPalette.surface?.primaryHover,
         }}
         effect={[
            {
               type: "drop-shadow",
               color: colorPalette.surface?.inputBg as string,
               offset: {
                  x: 0,
                  y: 2,
               },
               blur: 3,
            },
            {
               type: "drop-shadow",
               color: "#00000026",
               offset: {
                  x: 0,
                  y: 6,
               },
               blur: 10,
               spread: 4,
            },
         ]}
         fill={colorPalette.surface?.primary}
         cornerRadius={8}
         spacing={12}
         padding={{
            top: 16,
            right: 64,
            bottom: 16,
            left: 32,
         }}
         width="fill-parent"
         horizontalAlignItems="center"
         verticalAlignItems="center"
         {...props}
      >
         <Text name="text" fill={colorPalette.text?.inverted} lineHeight={22} fontSize={17} fontWeight={600}>
            {children}
         </Text>
         <SVG
            name="plus"
            opacity={0.9}
            x={{
               type: "right",
               offset: 22.333,
            }}
            y={{
               type: "center",
               offset: 0,
            }}
            positioning="absolute"
            height={19}
            width={19}
            src={svgPaths.plus}
         />
      </AutoLayout>
   )
}

interface SelectorProps<A extends string[] = string[]> extends CreatorCompKitConfig, ContainsEvent<[WidgetClickEvent, IndexesOf<A>]> {
   options: A
   /** ToolTips for option[number] */
   tips?: string[]
}

export function Selector({ onEvent, tips, options, value, colorPalette, ...props }: SelectorProps) {
   /** Selector Option */
   interface OptionProps extends Partial<AutoLayoutProps>, ContainsEvent {
      optionIndex: number
      children: string
   }

   const Option = ({ value, onEvent, children, optionIndex, ...props }: OptionProps) => {
      return (
         <AutoLayout
            name="Direction"
            onClick={onEvent}
            hoverStyle={{ fill: value == optionIndex ? colorPalette.surface?.actionHover : "" }}
            fill={value == optionIndex ? colorPalette.surface?.action : ""}
            stroke={value == optionIndex ? colorPalette.surface?.primary30 : ""}
            cornerRadius={55}
            overflow="visible"
            spacing={12}
            padding={{
               vertical: 8,
               horizontal: 16,
            }}
            width="fill-parent"
            horizontalAlignItems="center"
            verticalAlignItems="center"
            {...props}
         >
            <Text
               hoverStyle={{ opacity: 1 }}
               opacity={value == optionIndex ? 1 : 0.5}
               name={`Selector Option ${String(value)}`}
               fill={value == optionIndex ? colorPalette.text?.white : colorPalette.text?.default}
               lineHeight={22}
               fontSize={14}
               fontWeight={600}
            >
               {children}
            </Text>
         </AutoLayout>
      )
   }

   // Main
   return (
      <AutoLayout
         name="Selector"
         fill={colorPalette.surface?.inputBg}
         cornerRadius={55}
         overflow="visible"
         spacing="auto"
         padding={4}
         width="fill-parent"
         verticalAlignItems="center"
         {...props}
      >
         {options.map((option, index) => (
            <Option key={index} value={value} onEvent={(e) => onEvent(e, index as IndexesOf<typeof options>)} optionIndex={index} tooltip={tips && tips[index]}>
               {option}
            </Option>
         ))}
      </AutoLayout>
   )
}

interface TextInputProps extends CreatorCompKitConfig, ContainsEvent<[TextEditEvent]> {
   placeholder: string
   isResizable?: boolean
}

export function TextInput({ isResizable, colorPalette, onEvent, placeholder, value, ...props }: TextInputProps) {
   return (
      <AutoLayout
         name="TextInput"
         fill={colorPalette.surface?.inputBg}
         cornerRadius={8}
         overflow="visible"
         spacing={8}
         padding={{
            vertical: 8,
            horizontal: 16,
         }}
         width="fill-parent"
         height={"hug-contents"}
         minHeight={isResizable ? 64 : 30}
         {...props}
      >
         <Input
            name="Input"
            onTextEditEnd={onEvent}
            value={value}
            placeholder={placeholder}
            fill={colorPalette.text?.default}
            width="fill-parent"
            height={"hug-contents"}
            lineHeight={22}
            fontSize={14}
            fontWeight={500}
         />
      </AutoLayout>
   )
}

interface IconProps extends Partial<AutoLayoutProps>, ReqCompProps, PartialPick<ContainsEvent, "value"> {
   icon: "reset" | "hide" | "show"
   color: string
}

export function Icon({ onEvent, icon, color, ...props }: IconProps) {
   const svgPaths = {
      reset: `<svg width='24' height='21' viewBox='0 0 28 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
         <path d='M15.9201 0.47998C9.55846 0.47998 4.40006 5.63838 4.40006 12H0.560059L5.68006 17.12L10.8001 12H6.96006C6.96006 7.05918 10.9793 3.03998 15.9201 3.03998C20.8609 3.03998 24.8801 7.05918 24.8801 12C24.8801 16.9408 20.8609 20.96 15.9201 20.96C13.4881 20.96 11.2865 19.9872 9.67366 18.4128L7.85606 20.2176C9.92966 22.2528 12.7841 23.52 15.9201 23.52C22.2817 23.52 27.4401 18.3616 27.4401 12C27.4401 5.63838 22.2817 0.47998 15.9201 0.47998Z' fill='${color}'/>
      </svg>`,
      hide: `<svg width="24" height="21" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M1.9998 0.5L13.9998 12.5M11.3748 10.0669C10.3603 10.6134 9.21375 10.9999 7.9998 10.9999C5.35181 10.9999 3.02456 9.16085 1.68998 7.83411C1.3377 7.48389 1.16159 7.3088 1.04948 6.96509C0.969522 6.71996 0.969497 6.27993 1.04948 6.03481C1.16163 5.6911 1.3381 5.51559 1.69108 5.16475C2.36374 4.49616 3.28839 3.69769 4.37902 3.07007M13.6248 8.47513C13.8745 8.25538 14.1034 8.03922 14.3086 7.8352L14.3108 7.83292C14.6623 7.48357 14.8385 7.30841 14.9504 6.96546C15.0304 6.72034 15.0302 6.28013 14.9503 6.035C14.8382 5.6914 14.6619 5.51581 14.3098 5.16583C12.9752 3.83906 10.6477 2 7.9998 2C7.74667 2 7.49648 2.01681 7.2498 2.04836M8.99198 7.625C8.72753 7.85838 8.3802 8 7.9998 8C7.17137 8 6.4998 7.32843 6.4998 6.5C6.4998 6.09538 6.66001 5.72831 6.92046 5.4585" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      show: `<svg width='24' height='16' viewBox='0 0 20 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
         <path d='M1.5868 7.77881C3.36623 9.54783 6.46953 11.9999 10.0002 11.9999C13.5308 11.9999 16.6335 9.54783 18.413 7.77881C18.8823 7.31226 19.1177 7.07819 19.2671 6.62012C19.3738 6.29328 19.3738 5.70674 19.2671 5.3799C19.1177 4.92181 18.8823 4.6877 18.413 4.22111C16.6335 2.45208 13.5308 0 10.0002 0C6.46953 0 3.36623 2.45208 1.5868 4.22111C1.11714 4.68802 0.882286 4.92165 0.732796 5.3799C0.626177 5.70673 0.626177 6.29328 0.732796 6.62012C0.882286 7.07837 1.11714 7.31189 1.5868 7.77881Z' stroke='${color}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>
         <path d='M8 6C8 7.10457 8.89543 8 10 8C11.1046 8 12 7.10457 12 6C12 4.89543 11.1046 4 10 4C8.89543 4 8 4.89543 8 6Z' stroke='${color}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>
      </svg>`,
   }

   return (
      <AutoLayout
         name={`Icon ${icon}`}
         x={{
            type: "right",
            offset: 6,
         }}
         y={10}
         onClick={onEvent}
         positioning="absolute"
         strokeWidth={0.32}
         overflow="visible"
         direction="vertical"
         spacing={2.56}
         padding={2.56}
         width={32}
         height={32}
         verticalAlignItems="center"
         opacity={0.5}
         rotation={0}
         hoverStyle={{ opacity: 1 }}
         horizontalAlignItems="center"
         {...props}
      >
         <SVG name="Vector" src={svgPaths[icon]} overflow="visible" />
      </AutoLayout>
   )
}

interface SliderProps extends CreatorCompKitConfig, ContainsEvent<[WidgetClickEvent], boolean> {}

/** Selector Conditional */
export function Slider({ colorPalette, value, ...props }: SliderProps) {
   return (
      <AutoLayout
         name="Swipe"
         // fill="#313131"
         fill={colorPalette.surface?.inputBg}
         cornerRadius={81}
         overflow="visible"
         spacing={12}
         padding={6}
         width={80}
         horizontalAlignItems={value ? "end" : "start"}
         verticalAlignItems="center"
         {...props}
      >
         <Rectangle
            name="State"
            hoverStyle={{
               fill: value ? colorPalette.surface?.primaryHover : colorPalette.surface?.actionHover,
            }}
            fill={value ? colorPalette.surface?.primary : colorPalette.surface?.action}
            stroke={colorPalette.surface?.primary30}
            cornerRadius={17}
            width={28}
            height={28}
         />
      </AutoLayout>
   )
}

// ↓↓↓ вставь этот блок в конец файла

export function DropZone({ label, onDropBytes, ...props }: { label: string; onDropBytes: (bytes: Uint8Array) => Promise<void> | void } & Partial<AutoLayoutProps>) {
  const onDrop = figma.widget.useDropHandler(async (drop) => {
    const f = drop.files?.[0]
    if (!f) return
    if (!(f.type || "").startsWith("image/")) return
    const bytes = await f.getBytesAsync()
    await onDropBytes(bytes)
  })

  return (
    <AutoLayout
      name="DropZone"
      width={"fill-parent"}
      height={44}
      cornerRadius={8}
      stroke={"#FFFFFF22"}
      strokeDashPattern={[8, 6]}
      verticalAlignItems="center"
      horizontalAlignItems="center"
      hoverStyle={{ stroke: "#FFFFFF44" }}
      onDrop={onDrop}
      {...props}
    >
      <Text opacity={0.85}>{label}</Text>
    </AutoLayout>
  )
}
