import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Settings,
  Clock,
  Building2,
  Shield,
  Activity,
  BarChart3,
} from "lucide-react";

const HomeView = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-muted'>
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center mb-16'>
          <div className='flex items-center justify-center mb-6'>
            <div className='flex aspect-square size-16 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg'>
              <Building2 className='h-8 w-8' />
            </div>
          </div>
          <h1 className='text-5xl font-bold text-foreground mb-6 text-balance'>
            WeLink Cargo
            <span className='block text-3xl text-primary mt-2'>
              Parking Management System
            </span>
          </h1>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto text-pretty'>
            Enterprise-grade parking reservation and management platform
            designed for efficient vehicle access control and comprehensive
            business operations
          </p>
          <div className='flex items-center justify-center gap-2 mt-6'>
            <Badge variant='secondary' className='text-sm'>
              <Activity className='mr-1 h-3 w-3' />
              Real-time Updates
            </Badge>
            <Badge variant='secondary' className='text-sm'>
              <Shield className='mr-1 h-3 w-3' />
              Enterprise Security
            </Badge>
            <Badge variant='secondary' className='text-sm'>
              <BarChart3 className='mr-1 h-3 w-3' />
              Advanced Analytics
            </Badge>
          </div>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16'>
          <Card className='hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-card/50 backdrop-blur'>
            <CardHeader className='pb-4'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='flex aspect-square size-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                  <Car className='h-5 w-5' />
                </div>
                <CardTitle className='text-xl'>Gate Access System</CardTitle>
              </div>
              <CardDescription className='text-base'>
                Streamlined check-in process for visitors and subscribers with
                real-time availability
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-0'>
              <ul className='text-sm text-muted-foreground mb-6 space-y-2'>
                <li>• Real-time zone availability tracking</li>
                <li>• Visitor and subscriber flow management</li>
                <li>• Automated ticket generation</li>
                <li>• Multi-gate support</li>
              </ul>
              <Button asChild className='w-full' size='lg'>
                <Link href='/gate'>Access Gate System</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className='hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-card/50 backdrop-blur'>
            <CardHeader className='pb-4'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='flex aspect-square size-10 items-center justify-center rounded-lg bg-accent/10 text-accent'>
                  <Clock className='h-5 w-5' />
                </div>
                <CardTitle className='text-xl'>Employee Checkpoint</CardTitle>
              </div>
              <CardDescription className='text-base'>
                Professional checkout and payment processing for employee
                operations
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-0'>
              <ul className='text-sm text-muted-foreground mb-6 space-y-2'>
                <li>• Employee authentication system</li>
                <li>• Ticket scanning and validation</li>
                <li>• Automated payment calculation</li>
                <li>• Subscriber verification</li>
              </ul>
              <Button
                asChild
                variant='outline'
                className='w-full bg-transparent'
                size='lg'
              >
                <Link href='/checkpoint'>Employee Access</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className='hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-card/50 backdrop-blur md:col-span-2 lg:col-span-1'>
            <CardHeader className='pb-4'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='flex aspect-square size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive'>
                  <Settings className='h-5 w-5' />
                </div>
                <CardTitle className='text-xl'>Admin Dashboard</CardTitle>
              </div>
              <CardDescription className='text-base'>
                Comprehensive system management with advanced analytics and
                reporting
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-0'>
              <ul className='text-sm text-muted-foreground mb-6 space-y-2'>
                <li>• Real-time system monitoring</li>
                <li>• Zone and rate management</li>
                <li>• Advanced analytics dashboard</li>
                <li>• User and role management</li>
              </ul>
              <Button
                asChild
                variant='outline'
                className='w-full bg-transparent'
                size='lg'
              >
                <Link href='/admin'>Admin Panel</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className='bg-card/30 backdrop-blur rounded-2xl p-12 max-w-6xl mx-auto shadow-lg'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold mb-4'>Enterprise Features</h2>
            <p className='text-muted-foreground text-lg'>
              Built for scale, designed for efficiency
            </p>
          </div>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='flex aspect-square size-12 items-center justify-center rounded-lg bg-primary/10 text-primary mx-auto mb-4'>
                <Activity className='h-6 w-6' />
              </div>
              <h3 className='font-semibold mb-3'>Real-time Updates</h3>
              <p className='text-sm text-muted-foreground'>
                Live availability tracking with WebSocket connections for
                instant updates across all interfaces
              </p>
            </div>
            <div className='text-center'>
              <div className='flex aspect-square size-12 items-center justify-center rounded-lg bg-accent/10 text-accent mx-auto mb-4'>
                <Shield className='h-6 w-6' />
              </div>
              <h3 className='font-semibold mb-3'>Multi-user Support</h3>
              <p className='text-sm text-muted-foreground'>
                Role-based access control with separate interfaces for visitors,
                subscribers, employees, and administrators
              </p>
            </div>
            <div className='text-center'>
              <div className='flex aspect-square size-12 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4 mx-auto mb-4'>
                <BarChart3 className='h-6 w-6' />
              </div>
              <h3 className='font-semibold mb-3'>Smart Pricing</h3>
              <p className='text-sm text-muted-foreground'>
                Dynamic rate calculation based on rush hours, vacation periods,
                and category-specific pricing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
