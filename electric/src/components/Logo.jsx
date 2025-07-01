import { Zap } from 'lucide-react'
import React from 'react'
import {motion} from "framer-motion"

const Logo = () => {
  return (
        <div className="h-full w-full border-b border-gray-700 flex justify-center items-center px-6 py-10">
            <div className="flex items-center">
                <Zap className="w-8 h-8 text-purple-400 mr-2" />
                <motion.span
                style={{ fontFamily: "'Monoton', sans-serif", fontStyle:'normal' }}
                className="text-white text-2xl tracking-wide uppercase relative overflow-hidden"
                animate={{
                    x: [0, -2, 2, -1, 1, 0],
                    skewX: [0, 5, -5, 3, -3, 0],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                }}
                >
                Zap<span className="text-purple-400">Zone</span>
                </motion.span>
            </div>
        </div>
  )
}

export default Logo