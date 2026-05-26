import { NextRequest, NextResponse } from 'next/server';
import { getUser, toggleSaveRecipe } from '@/lib/db/queries';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const recipeId = Number(id);
  if (isNaN(recipeId)) {
    return NextResponse.json({ error: 'Invalid recipe ID' }, { status: 400 });
  }

  const { isSaved } = await request.json() as { isSaved: boolean };

  await toggleSaveRecipe(recipeId, user.id, isSaved);

  return NextResponse.json({ success: true, isSaved });
}
