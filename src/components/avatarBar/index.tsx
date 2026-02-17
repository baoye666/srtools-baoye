"use client"
import Image from "next/image"
import { useEffect } from "react"
import CharacterCard from "../card/characterCard"
import useLocaleStore from "@/stores/localeStore"
import useAvatarStore from "@/stores/avatarStore"
import { useTranslations } from "next-intl"


export default function AvatarBar({ onClose }: { onClose?: () => void }) {
    const {
        listAvatar,
        setAvatarSelected,
        setSkillSelected,
        setFilter,
        filter,
        listElement,
        listPath,
        setListElement,
        setListPath
    } = useAvatarStore()
    const transI18n = useTranslations("DataPage")
    const { locale } = useLocaleStore()


    useEffect(() => {
        setFilter({ ...filter, locale: locale, element: Object.keys(listElement).filter((key) => listElement[key]), path: Object.keys(listPath).filter((key) => listPath[key]) })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locale, listElement, listPath])


    return (
        <div className="grid grid-flow-row h-full auto-rows-max w-full">
            <div className="h-full rounded-lg mx-2 py-2">
                <div className="container">
                    <div className="flex flex-col h-full gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-center">
                                <input type="text"
                                    placeholder={transI18n("placeholderCharacter")}
                                    className="input input-bordered input-primary w-full"
                                    value={filter.name}
                                    onChange={(e) => setFilter({ ...filter, name: e.target.value, locale: locale })}
                                />
                            </div>
                            <div className="grid grid-cols-7 sm:grid-cols-4  lg:grid-cols-7 mb-1 mx-1 gap-2 w-full max-h-[17vh] min-h-[5vh] overflow-y-auto">
                                {Object.keys(listElement).map((key, index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setListElement({ ...listElement, [key]: !listElement[key] })
                                        }}
                                        className="hover:bg-gray-600 grid items-center justify-items-center cursor-pointer rounded-md shadow-lg"
                                        style={{
                                            backgroundColor: listElement[key] ? "#374151" : "#6B7280"
                                        }}>
                                        <Image
                                            src={`/icon/${key}.webp`}
                                            alt={key}
                                            unoptimized
                                            crossOrigin="anonymous"
                                            className="h-7 w-7 2xl:h-10 2xl:w-10 object-contain rounded-md"
                                            width={200}
                                            height={200} />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-9 sm:grid-cols-5 lg:grid-cols-9 mb-1 mx-1 gap-2 overflow-y-auto w-full max-h-[17vh] min-h-[5vh]">
                                {Object.keys(listPath).map((key, index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setListPath({ ...listPath, [key]: !listPath[key] })
                                        }}
                                        className="hover:bg-gray-600 grid items-center justify-items-center rounded-md shadow-lg cursor-pointer"
                                        style={{
                                            backgroundColor: listPath[key] ? "#374151" : "#6B7280"
                                        }}
                                    >

                                        <Image
                                            src={`/icon/${key}.webp`}
                                            unoptimized
                                            crossOrigin="anonymous"
                                            alt={key}
                                            className="h-7 w-7 2xl:h-10 2xl:w-10 object-contain rounded-md"
                                            width={200}
                                            height={200} />
                                    </div>
                                ))}

                            </div>
                        </div>

                        <div className="flex items-start h-full">
                            <ul className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full h-[65vh] overflow-y-scroll overflow-x-hidden">
                                {listAvatar.map((item, index) => (
                                    <div key={index} onClick={() => {
                                        setAvatarSelected(item);
                                        setSkillSelected(null)
                                        if (onClose) onClose()
                                    }}>
                                        <CharacterCard data={item} />
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
