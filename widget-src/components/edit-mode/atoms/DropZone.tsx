// widget-src/components/edit-mode/atoms/DropZone.tsx
const { AutoLayout, Text } = figma.widget

interface DropZoneProps extends Partial<AutoLayoutProps> {
  label: string
  onDropBytes: (bytes: Uint8Array) => Promise<void> | void
}

/** Безопасная drop-зона: работает, если рантайм поддерживает useDropHandler; иначе — просто UI. */
export function DropZone({ label, onDropBytes, ...props }: DropZoneProps) {
  const maybeUseDropHandler = (figma.widget as any)?.useDropHandler as
    | ((cb: (drop: any) => any) => (ev: any) => void)
    | undefined

  const onDrop =
    typeof maybeUseDropHandler === "function"
      ? maybeUseDropHandler(async (drop: any) => {
          const f = drop.files?.[0]
          if (!f) return
          if (!(f.type || "").startsWith("image/")) return
          const bytes = await f.getBytesAsync()
          await onDropBytes(bytes)
        })
      : undefined

  const notSupported = !onDrop

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
      tooltip={notSupported ? "Drag & drop изображений недоступен в этом билде Figma (widgetApi 1.0.0)" : undefined}
      {...props}
    >
      <Text opacity={0.85}>
        {label}
        {notSupported ? " (недоступно в текущей версии Figma)" : ""}
      </Text>
    </AutoLayout>
  )
}
