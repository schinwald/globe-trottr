import * as PrimitivePortal from "@radix-ui/react-portal"
import * as Slot from "@radix-ui/react-slot"
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useRef,
  useState,
} from "react"
import { v4 as uuid } from "uuid"
import { cn } from "@/utils/classname"

type FloaterContext = {
  ref: React.RefObject<HTMLDivElement | null>
  spawner: Set<string>
  setSpawner: Dispatch<SetStateAction<Set<string>>>
}

const FloaterContext = createContext<FloaterContext>({
  ref: { current: null },
  spawner: new Set<string>(),
  setSpawner: () => {},
})

export const Root: React.FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [spawner, setSpawner] = useState(new Set<string>())

  return (
    <FloaterContext.Provider value={{ ref, spawner, setSpawner }}>
      <div ref={ref} className="relative">
        {children}
      </div>
    </FloaterContext.Provider>
  )
}

type PortalProps = PrimitivePortal.PortalProps

export const Portal: React.FC<PortalProps> = ({
  children,
  className,
  ...props
}) => {
  const { ref, spawner, setSpawner } = useContext(FloaterContext)

  return (
    <>
      {Array.from(spawner).map((spawn) => (
        <PrimitivePortal.Root
          key={spawn}
          container={ref?.current}
          className={cn(
            "pointer-events-none absolute bottom-6 left-[50%] animate-float-away rounded-md p-3 text-foreground opacity-0",
            className
          )}
          onAnimationEnd={() =>
            setSpawner((spawner) => {
              spawner.delete(spawn)
              return new Set(spawner)
            })
          }
          {...props}
        >
          {children}
        </PrimitivePortal.Root>
      ))}
    </>
  )
}

type TriggerProps = Slot.SlotProps & { asChild?: boolean }

export const Trigger: React.FC<TriggerProps> = ({ asChild, ...props }) => {
  const { setSpawner } = useContext(FloaterContext)
  const Component = asChild ? Slot.Root : "button"

  return (
    <Component
      onClick={() => {
        setSpawner((spawner) => {
          spawner.add(uuid())
          return new Set(spawner)
        })
      }}
      {...props}
    />
  )
}

export const Floater = {
  Root,
  Portal,
  Trigger,
}
