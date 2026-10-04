'use client';

import { useState } from 'react';
import { Trash2, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CONFIRM_WORD = 'DELETE';

const DeleteAccountDialog = () => {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setConfirmText('');
      }}
    >
      <DialogTrigger render={<Button variant='destructive' />}>
        <Trash2 />
        Delete account
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <span className='mb-1 flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
            <TriangleAlert className='size-5' />
          </span>
          <DialogTitle>Delete your account?</DialogTitle>
          <DialogDescription>
            This is permanent. You will be signed out immediately and lose access to your
            assessments and data. Only an administrator can restore a deleted account.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-1.5'>
          <Label htmlFor='confirm-delete'>
            Type <span className='font-semibold'>{CONFIRM_WORD}</span> to confirm
          </Label>
          <Input
            id='confirm-delete'
            value={confirmText}
            autoComplete='off'
            className='h-11'
            onChange={(event) => setConfirmText(event.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant='outline' />}>Cancel</DialogClose>
          <Button variant='destructive' disabled={confirmText !== CONFIRM_WORD}>
            Delete my account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountDialog;
