import { NextRequest } from 'next/server';
import { okResponse } from '@/lib/api/api-response';
import { generateRequestId } from '@/lib/api/request-context';

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();

  return okResponse({
    status: 'ok',
    service: 'bottlecap-api',
    phase: 12
  }, requestId);
}
