import * as PrimitivePortal from "@radix-ui/react-portal"
import { AnimatePresence, motion } from "framer-motion"
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useRef,
} from "react"
import { IoMdArrowDropleft as ArrowLeftIcon } from "react-icons/io"
import { useShallow } from "zustand/shallow"
import { cn } from "@/utils/classname"
import { useGameStore } from "../hooks/room"

type NotificationContext = {
  ref: React.RefObject<HTMLDivElement | null>
}

const NotificationContext = createContext<NotificationContext>({
  ref: { current: null },
})

type RootProps = PropsWithChildren

export const Root: React.FC<RootProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <NotificationContext.Provider value={{ ref }}>
      <div ref={ref} className="relative">
        {children}
      </div>
    </NotificationContext.Provider>
  )
}

type PortalProps = { userId: string } & PrimitivePortal.PortalProps

export const Notification: React.FC<PortalProps> = ({
  userId,
  children,
  className,
  ...props
}) => {
  const { ref } = useContext(NotificationContext)
  const { messages, dismissMessage } = useGameStore(
    useShallow((state) => ({
      messages: state.messages,
      dismissMessage: state.dismissMessage,
    }))
  )

  return (
    <AnimatePresence mode="popLayout">
      {Object.entries(messages)
        .filter(([_, data]) => {
          return data.userId === userId
        })
        .map(([id, data]) => (
          <PrimitivePortal.Root
            key={id}
            container={ref?.current}
            className={cn(
              "pointer-events-none absolute left-[100%] top-[50%] -translate-y-[50%] text-foreground z-40",
              className
            )}
            {...props}
          >
            <motion.div
              className="origin-left"
              initial={{ opacity: 0, translateX: "-10px", scale: 0.7 }}
              animate={{ opacity: 1, translateX: "0px", scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.1,
                onComplete: () => {
                  setTimeout(
                    () => {
                      dismissMessage(id)
                    },
                    1500 + data.message.length * 50
                  )
                },
              }}
            >
              <div className="flex flex-row items-center ml-2">
                <ArrowLeftIcon className="size-5 -m-2 text-primary" />
                <div className="rounded-full px-4 py-2 bg-primary text-white border-gray-300 whitespace-nowrap">
                  {data.message}
                </div>
              </div>
            </motion.div>
          </PrimitivePortal.Root>
        ))}
    </AnimatePresence>
  )
}

export const Guess = {
  Root,
  Notification,
}
