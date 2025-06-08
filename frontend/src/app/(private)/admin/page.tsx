'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Tag,
  ChevronRight,
} from 'lucide-react';
import { useUsers } from '@/features/user/hooks';
import LoadingSpinner from '@/components/ui/common/LoadingSpinner';
import { useTags } from '@/features/tag/hooks';

interface AdminCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  stats?: {
    label: string;
    value: string | number;
    color: string;
  };
  color: {
    bg: string;
    icon: string;
    hover: string;
  };
}

export default function AdminPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const { data, isLoading: usersLoading, isError: usersError } = useUsers();

  const totalUsers = data?.total;

  const { data: tags, isLoading: tagsLoading, isError: tagsError } = useTags();


  if (!tags || usersLoading || tagsLoading) {
    return <LoadingSpinner />
  }

  if (usersError || tagsError) {
    return <p>Unknown error</p>
  }

  const adminCards: AdminCard[] = [
    {
      title: 'User Management',
      description: 'Manage user accounts, roles, permissions and view user activity',
      icon: <Users className="w-8 h-8" />,
      href: '/admin/users',
      stats: {
        label: 'Active Users',
        value: totalUsers ? totalUsers : 0,
        color: 'text-blue-600'
      },
      color: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        hover: 'hover:bg-blue-100'
      }
    },
    {
      title: 'Tag Management',
      description: 'Create, edit and organize tags for events and content categorization',
      icon: <Tag className="w-8 h-8" />,
      href: '/admin/tags',
      stats: {
        label: 'Total Tags',
        value: tags.length,
        color: 'text-purple-600'
      },
      color: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        hover: 'hover:bg-purple-100'
      }
    }
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, Admin
          </h2>
          <p className="text-gray-600">
            Application management
          </p>
        </div>

        {/* Main Management Cards */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Management Tools
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {adminCards.map((card, index) => (
              <Link
                key={index}
                href={card.href}
                onMouseEnter={() => setHoveredCard(card.title)}
                onMouseLeave={() => setHoveredCard(null)}
                className="block group"
              >
                <div className={`
                  bg-white rounded-2xl shadow-sm border border-gray-200 p-6 
                  transition-all duration-300 cursor-pointer
                  hover:shadow-lg hover:border-gray-300 hover:-translate-y-1
                  ${hoveredCard === card.title ? 'shadow-lg border-gray-300 -translate-y-1' : ''}
                `}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`
                      flex items-center justify-center w-16 h-16 rounded-2xl
                      ${card.color.bg} ${card.color.hover} transition-colors duration-200
                    `}>
                      <div className={card.color.icon}>
                        {card.icon}
                      </div>
                    </div>

                    <ChevronRight className={`
                      w-5 h-5 text-gray-400 transition-all duration-200
                      ${hoveredCard === card.title ? 'text-gray-600 translate-x-1' : ''}
                    `} />
                  </div>

                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {card.title}
                  </h4>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {card.description}
                  </p>

                  {card.stats && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-500">
                        {card.stats.label}
                      </span>
                      <span className={`text-lg font-bold ${card.stats.color}`}>
                        {card.stats.value}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}