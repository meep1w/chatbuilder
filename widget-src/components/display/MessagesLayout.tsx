// widget-src/components/display/MessagesLayout.tsx

// Dependencies
const { AutoLayout } = figma.widget
// Components
import { DirectionContainer, WithButtons } from "@/components/display/atoms"
import { Message as MessageBubble } from "@/components/ui"

/** Пропсы компонента */
interface MessagesLayoutProps extends Partial<AutoLayoutProps>, ReqCompProps, OptionalRender {
  /** Сообщения всего чата (как раньше): массив блоков одной стороны */
  messages?: (Message[] | undefined)[]
  /** НОВОЕ: настройки пагинации (окно/сдвиг/автоскролл) */
  paging?: Paging
}

/** Вспомогательное: плоский список сообщений в хронологическом порядке */
function flatten(messages?: (Message[] | undefined)[]): Message[] {
  if (!messages) return []
  const out: Message[] = []
  for (const group of messages) {
    if (!group) continue
    for (const m of group) out.push(m)
  }
  return out
}

/** Вспомогательное: сгруппировать подряд идущие сообщения по направлению */
function groupByDirection(list: Message[]): Message[][] {
  const res: Message[][] = []
  let cur: Message[] = []
  let prevDir: any = null

  for (const m of list) {
    if (prevDir == null || m.dir === prevDir) {
      cur.push(m)
    } else {
      if (cur.length) res.push(cur)
      cur = [m]
    }
    prevDir = m.dir
  }
  if (cur.length) res.push(cur)
  return res
}

/** Компонент ленты сообщений с поддержкой пагинации */
export function MessagesLayout({
  messages,
  paging,
  renderElements,
  children,
  theme,
  ...props
}: MessagesLayoutProps) {
  // ---- Подготовка видимого среза (пагинация от конца) ----
  const all = flatten(messages) // [m1, m2, ... mN]
  const N = all.length

  // параметры пагинации
  const w = Math.max(1, paging?.window ?? N) // если нет paging — показываем всё
  const off = Math.max(0, Math.min(paging?.offset ?? 0, Math.max(0, N - 1)))

  // берём окно [from, to) с конца
  const to = Math.max(0, N - off)
  const from = Math.max(0, to - w)
  const visibleList = all.slice(from, to)

  // если включён режим "рендерим только последний пузырь" — используем последний из видимых
  const lastMessage = visibleList[visibleList.length - 1]

  // для полного режима сгруппируем подряд идущие по направлению,
  // чтобы корректно рисовать DirectionContainer
  const grouped = groupByDirection(visibleList)

  // ====== Режим Only-Preview (когда renderElements === false) ======
  if (!renderElements) {
    return (
      <>
        {lastMessage ? (
          <AutoLayout direction="vertical" spacing={28}>
            <WithButtons buttons={lastMessage.buttons ?? []} theme={theme}>
              {/* Спредом прокидываем ВСЕ поля, включая time/src/imgW/imgH */}
              <MessageBubble {...lastMessage} theme={theme} />
            </WithButtons>
            {children}
          </AutoLayout>
        ) : (
          children
        )}
      </>
    )
  }

  // ====== Полный режим ленты ======
  return (
    <AutoLayout
      name="Container Layout"
      x={{ type: "left-right", leftOffset: 0, rightOffset: 0 }}
      y={{ type: "bottom", offset: 0 }}
      overflow="visible"
      direction="vertical"
      spacing={24}
      padding={{ vertical: 16, horizontal: 8 }}
      width={390}
      verticalAlignItems="end"
      horizontalAlignItems="center"
      {...props}
    >
      {grouped.map((dirGroup, i) => (
        <DirectionContainer key={`dir-${i}`} dir={dirGroup[0].dir}>
          {dirGroup.map((msg, j) => (
            <WithButtons key={msg.id ?? `m-${i}-${j}`} buttons={msg.buttons ?? []} theme={theme}>
              {/* Спредом прокидываем ВСЕ поля, включая time/src/imgW/imgH */}
              <MessageBubble {...msg} theme={theme} />
            </WithButtons>
          ))}
        </DirectionContainer>
      ))}

      {children}
    </AutoLayout>
  )
}
