// widget-src/components/edit-mode/atoms/DropZone.tsx
const { AutoLayout, Text, useDropHandler } = figma.widget

interface DropZoneProps extends Partial<AutoLayoutProps> {
  label: string
  onDropBytes: (bytes: Uint8Array) => Promise<void> | void
}

/** Простая drop-зона для изображений (image/*). Возвращает bytes первого файла. */
export function DropZone({ label, onDropBytes, ...props }: DropZoneProps) {
  const onDrop = useDropHandler(async (drop) => {
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
