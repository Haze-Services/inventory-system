'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { MoreHorizontal, Search, Plus, Edit, Trash2 } from 'lucide-react'
import type { Warranty } from '@/lib/types'

interface WarrantiesTableProps {
  warranties: Warranty[]
  onEdit: (warranty: Warranty) => void
  onDelete: (warranty: Warranty) => void
  onAdd: () => void
  loading?: boolean
}

export function WarrantiesTable({ warranties, onEdit, onDelete, onAdd, loading = false }: WarrantiesTableProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredWarranties = warranties.filter(
    (warranty) =>
      warranty.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.product?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusVariant = (status: Warranty['status']) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'expired':
        return 'secondary'
      case 'claimed':
        return 'warning'
      case 'void':
        return 'destructive'
      default:
        return 'default'
    }
  }

  if (loading) {
    return (
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <div className='w-64 h-10 bg-muted animate-pulse rounded'></div>
          <div className='w-32 h-10 bg-muted animate-pulse rounded'></div>
        </div>
        <div className='border rounded-lg'>
          <div className='h-96 bg-muted animate-pulse rounded-lg'></div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <div className='relative w-64'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Search warranties...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>
        <Button onClick={onAdd}>
          <Plus className='h-4 w-4 mr-2' />
          Add Warranty
        </Button>
      </div>

      <div className='border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Warranty Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-[50px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWarranties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='text-center py-8 text-muted-foreground'>
                  {searchTerm
                    ? 'No warranties found matching your search.'
                    : 'No warranties found. Add your first warranty to get started.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredWarranties.map((warranty) => (
                <TableRow key={warranty.id}>
                  <TableCell>
                    <div className='font-medium'>{warranty.product?.name || 'N/A'}</div>
                    <div className='text-sm text-muted-foreground'>{warranty.product?.sku || ''}</div>
                  </TableCell>
                  <TableCell>
                    <div className='font-medium'>{warranty.customer_name}</div>
                    <div className='text-sm text-muted-foreground'>{warranty.customer_email}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {new Date(warranty.purchase_date).toLocaleDateString()} - {new Date(warranty.expiry_date).toLocaleDateString()}
                    </div>
                    <div className='text-sm text-muted-foreground'>{warranty.warranty_period_months} months</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(warranty.status)}>{warranty.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='sm'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => onEdit(warranty)}>
                          <Edit className='h-4 w-4 mr-2' />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(warranty)} className='text-destructive'>
                          <Trash2 className='h-4 w-4 mr-2' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredWarranties.length > 0 && (
        <div className='text-sm text-muted-foreground'>
          Showing {filteredWarranties.length} of {warranties.length} warranties
        </div>
      )}
    </div>
  )
}
