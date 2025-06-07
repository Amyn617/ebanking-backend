package ma.enset.dto;

import lombok.Data;

@Data
public class CreateCurrentAccountRequest {
    private double initialBalance;
    private double overDraft;
    private Long customerId;
}
