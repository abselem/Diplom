from celery import shared_task
from datetime import timedelta
from django.utils import timezone
from .models import Deposit, DepositTransfer


@shared_task
def calculate_interest():
    deposits = Deposit.objects.filter(is_active=True)
    for deposit in deposits:
        # Определяем разницу во времени между датой создания депозита и текущим временем
        time_diff = timezone.now() - deposit.created_at

        # Если прошло больше одного месяца, начисляем проценты
        if time_diff > timedelta(days=30):
            # Вычисляем сумму процентов
            interest_amount = deposit.sum * deposit.deposit_kind.interest_rate / 100
            # Создаем запись о начислении процентов
            transfer = DepositTransfer(
                sender_card=None,
                recipient_deposit=deposit,
                amount=interest_amount,
                date=timezone.now(),
                message=f'Начисление процентов по депозиту {deposit.name}'
            )
            transfer.save()

            # Обновляем сумму на депозите
            deposit.sum += interest_amount
            deposit.save()