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
  Shield,
  Activity,
  BarChart3,
} from "lucide-react";
import Image from "next/image";

const HomeView = () => {
  return (
    <div className='min-h-screen'>
      {/* Add padding top to account for fixed header */}
      <div className='pt-16 mx-auto px-4 pb-12'>
        <div className='text-center mb-16'>
          <div className='flex items-center justify-center mb-6'>
            <Image
              src='/welink-cargo-logo.png'
              width={200}
              height={200}
              alt='WeLink Cargo'
              className='object-cover'
            />
          </div>
          <h1 className='text-5xl font-bold text-foreground mb-6 text-balance'>
            WeLink Cargo
            <span className='block text-3xl text-primary mt-2'>
              Parking Management System
            </span>
          </h1>
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

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'>
          <Card className='group hover:shadow-xl transition-all duration-300'>
            <CardHeader className='text-center pb-4'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors'>
                <Car className='h-8 w-8' />
              </div>
              <CardTitle className='text-xl'>Gate Access System</CardTitle>
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

          <Card className='group hover:shadow-xl transition-all duration-300'>
            <CardHeader className='text-center pb-4'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors'>
                <Clock className='h-8 w-8' />
              </div>
              <CardTitle className='text-xl'>Employee Checkpoint</CardTitle>
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
                <Link href='/employee'>Employee Access</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className='group hover:shadow-xl transition-all duration-300 '>
            <CardHeader className='text-center pb-4'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-chart-4/10 group-hover:bg-chart-4 group-hover:text-white transition-colors'>
                <Settings className='h-8 w-8' />
              </div>
              <CardTitle className='text-xl'>Admin Dashboard</CardTitle>
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
      </div>
    </div>
  );
};

export default HomeView;
