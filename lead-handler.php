<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'message' => 'Method not allowed']);
  exit;
}

$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);
if (!is_array($payload)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'message' => 'Invalid payload']);
  exit;
}

$to = 'info@aviranglobal.com';
$type = isset($payload['type']) ? (string) $payload['type'] : 'lead';
$page = isset($payload['page']) ? (string) $payload['page'] : '';
$requestedAsset = isset($payload['requestedAsset']) ? (string) $payload['requestedAsset'] : '';
$requestedUrl = isset($payload['requestedUrl']) ? (string) $payload['requestedUrl'] : '';
$data = isset($payload['data']) && is_array($payload['data']) ? $payload['data'] : [];
$replyTo = isset($data['email']) && filter_var($data['email'], FILTER_VALIDATE_EMAIL)
  ? (string) $data['email']
  : 'info@aviranglobal.com';
$from = 'info@aviranglobal.com';

$subject = 'AVIRAN GLOBAL Lead: ' . $type;
$bodyLines = [];
$bodyLines[] = 'Lead Type: ' . $type;
$bodyLines[] = 'Page: ' . $page;
if ($requestedAsset !== '') {
  $bodyLines[] = 'Requested Asset: ' . $requestedAsset;
}
if ($requestedUrl !== '') {
  $bodyLines[] = 'Requested URL: ' . $requestedUrl;
}
$bodyLines[] = '';
$bodyLines[] = 'Submitted Details:';

foreach ($data as $key => $value) {
  if (is_scalar($value)) {
    $cleanKey = str_replace(["\r", "\n"], ' ', (string) $key);
    $cleanValue = str_replace(["\r", "\n"], ' ', (string) $value);
    $bodyLines[] = $cleanKey . ': ' . $cleanValue;
  }
}

$body = implode("\n", $bodyLines);
$headers = "From: {$from}\r\n" .
           "Reply-To: {$replyTo}\r\n" .
           "Return-Path: {$from}\r\n" .
           "MIME-Version: 1.0\r\n" .
           "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = @mail($to, $subject, $body, $headers, "-f {$from}");
if ($sent) {
  echo json_encode(['ok' => true]);
} else {
  http_response_code(500);
  echo json_encode(['ok' => false, 'message' => 'Mail could not be sent']);
}
