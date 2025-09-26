import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Users, Star } from 'lucide-react'

const PropertyCard = ({ property }) => {
  const {
    id,
    name,
    description,
    location,
    price_per_night,
    max_guests,
    amenities,
    image_url
  } = property

  // Parse amenities string into array
  const amenitiesList = amenities ? amenities.split(',').map(a => a.trim()).slice(0, 3) : []

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={image_url || '/api/placeholder/400/250'}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop'
          }}
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-900">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            4.8
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{name}</h3>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{location}</span>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              <span>Up to {max_guests} guests</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">${price_per_night}</span>
              <span className="text-sm text-gray-600">/night</span>
            </div>
          </div>
          
          {amenitiesList.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {amenitiesList.map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link to={`/property/${id}`} className="w-full">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default PropertyCard

