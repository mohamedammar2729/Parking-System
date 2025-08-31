export interface User {
  id: string
  username: string
  name: string
  role: "admin" | "employee"
}

export interface LoginResponse {
  user: User
  token: string
}

export interface Category {
  id: string
  name: string
  rateNormal: number
  rateSpecial: number
}

export interface Gate {
  id: string
  name: string
  zoneIds: string[]
  location: string
}

export interface Zone {
  id: string
  name: string
  categoryId: string
  gateIds: string[]
  totalSlots: number
  occupied: number
  free: number
  reserved: number
  availableForVisitors: number
  availableForSubscribers: number
  rateNormal: number
  rateSpecial: number
  open: boolean
}

export interface Subscription {
  id: string
  userName: string
  active: boolean
  category: string
  cars: Array<{
    plate: string
    brand: string
    model: string
    color: string
  }>
  startsAt: string
  expiresAt: string
  currentCheckins: Array<{
    ticketId: string
    zoneId: string
    checkinAt: string
  }>
}

export interface Ticket {
  id: string
  type: "visitor" | "subscriber"
  zoneId: string
  gateId: string
  checkinAt: string
  checkoutAt?: string
}

export interface CheckinRequest {
  gateId: string
  zoneId: string
  type: "visitor" | "subscriber"
  subscriptionId?: string
}

export interface CheckinResponse {
  ticket: Ticket
  zoneState: Zone
}

export interface CheckoutRequest {
  ticketId: string
  forceConvertToVisitor?: boolean
}

export interface CheckoutResponse {
  ticketId: string
  checkinAt: string
  checkoutAt: string
  durationHours: number
  breakdown: Array<{
    from: string
    to: string
    hours: number
    rateMode: "normal" | "special"
    rate: number
    amount: number
  }>
  amount: number
  zoneState: Zone
}

export interface ParkingStateReport {
  zoneId: string
  name: string
  totalSlots: number
  occupied: number
  free: number
  reserved: number
  availableForVisitors: number
  availableForSubscribers: number
  subscriberCount: number
  open: boolean
}


