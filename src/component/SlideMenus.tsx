import { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import MenuCard from './MenuCard'

const SlideMenus = () => {

    const menuList = [
        {
            id: 1,
            title: 'Pizza',
            description: 'Delicious cheese pizza',
            items: 4,
            status: '',
            lastUpdated: '1 hour ago'
        },
        {
            id: 2,
            title: 'Pizza',
            description: 'Delicious cheese pizza',
            items: 3,
            status: '',
            lastUpdated: '1 hour ago'
        },
        {
            id: 3,
            title: 'Pizza',
            description: 'Delicious cheese pizza',
            items: 3,
            status: '',
            lastUpdated: '1 hour ago'
        },
    ]
    
    const [emblaRef, emblaApi] = useEmblaCarousel({ 
        align: 'start', 
        containScroll: 'trimSnaps',
        loop: true,
        duration: 30
    })

    useEffect(() => {
        if (!emblaApi) return

        const interval = setInterval(() => {
            emblaApi.scrollNext()
        }, 10000)

        return () => clearInterval(interval)
    }, [emblaApi])

    return (
        <div className="overflow-hidden rounded-lg shadow-md" ref={emblaRef}>
            <div className="flex">
                {menuList.map((menu) => (
                    <div key={menu.id} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.333%] px-2">
                        <MenuCard 
                            title={menu.title} 
                            description={menu.description} 
                            items={menu.items} 
                            status={menu.status} 
                            lastUpdated={menu.lastUpdated} 
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SlideMenus